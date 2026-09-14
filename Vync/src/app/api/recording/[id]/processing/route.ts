import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🟢 1. SECURITY CHECK: Ensure request is coming from your Express Server
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.INTERNAL_SERVER_SECRET}`) {
      console.error("🔴 Unauthorized attempt to access processing API");
      return NextResponse.json({ error: "Unauthorized Service" }, { status: 401 });
    }

    const body = await req.json()
    const { id } = await params

    const personalworkspaceId = await client.user.findUnique({
      where: {
        id,
      },
      select: {
        workspace: {
          where: {
            type: 'PERSONAL',
          },
          select: {
            id: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!personalworkspaceId?.workspace?.length) {
      return NextResponse.json(
        {
          status: 404,
          message: 'Personal workspace not found',
        },
        { status: 404 }
      )
    }

    const startProcessingVideo = await client.workSpace.update({
      where: {
        id: personalworkspaceId.workspace[0].id,
      },
      data: {
        videos: {
          create: {
            source: body.filename,
            userId: id,
          },
        },
      },
      select: {
        User: {
          select: {
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      status: 200,
      plan: startProcessingVideo.User?.subscription?.plan,
    })
  } catch (error) {
    console.log('🔴 Error in processing video', error)

    return NextResponse.json(
      {
        status: 500,
        message: 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}