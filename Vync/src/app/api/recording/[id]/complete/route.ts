import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🟢 SECURITY CHECK: Ensure request is coming from your Express Server
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.INTERNAL_SERVER_SECRET}`) {
      console.error("🔴 Unauthorized attempt to access complete API");
      return NextResponse.json({ error: "Unauthorized Service" }, { status: 401 });
    }

    const body = await req.json()
    const { id } = await params

    const completeProcessing = await client.video.update({
      where: {
        userId: id,
        source: body.filename,
      },
      data: {
        processing: false,
        source: body.videoUrl, // Swaps the local filename for the permanent Cloudinary URL
      },
    })

    if (completeProcessing) {
      console.log('🟢 Video processing marked as complete in database')
      return NextResponse.json({ status: 200 })
    }

    return NextResponse.json(
      { status: 400, message: 'Record not found or failed to update' },
      { status: 400 }
    )
  } catch (error) {
    console.log('🔴 Error completing video processing:', error)

    return NextResponse.json(
      {
        status: 500,
        message: 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}