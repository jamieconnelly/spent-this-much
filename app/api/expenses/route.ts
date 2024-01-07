import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()
  try {
    const response = await fetch(
      `${process.env.API_SERVER_URL}/expenses`,

      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (!response.ok) {
      const data = await response.json()
      return NextResponse.json(
        { message: data?.detail },
        {
          status: 500,
        }
      )
    }
  } catch (e) {
    return NextResponse.json(
      { message: JSON.stringify(e) },
      {
        status: 500,
      }
    )
  }

  return NextResponse.json(
    {},
    {
      status: 200,
    }
  )
}
