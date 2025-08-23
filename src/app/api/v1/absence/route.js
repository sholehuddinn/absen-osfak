import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const absences = await prisma.absence.findMany({
      include: {
        pic: true,
        participant: true,
      },
    });
    return Response.json(absences, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { picNim, participantNim } = body;

    const pic = await prisma.user.findUnique({
      where: { nim: picNim },
    });

    const participant = await prisma.user.findUnique({
      where: { nim: participantNim },
    });

    if (!pic || !participant) {
      return NextResponse.json(
        { error: "PIC or Participant not found" },
        { status: 404 }
      );
    }

    const absen = await prisma.absence.create({
      data: {
        picId: pic.id,
        participantId: participant.id,
      },
      include: {
        pic: true,
        participant: true,
      },
    });

    return Response.json(absen, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create absence" },
      { status: 500 }
    );
  }
}

