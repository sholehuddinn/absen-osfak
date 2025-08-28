import prisma from "@/lib/prisma";

// PATCH /api/v1/tim/[id] -> tambah participant ke tim
export async function PATCH(req, { params }) {
  try {
    const { id } = params; // tim id
    const body = await req.json();
    const { participantIds } = body;

    if (!participantIds || participantIds.length === 0) {
      return Response.json({ error: "participantIds wajib diisi" }, { status: 400 });
    }

    // tambahkan participants
    await prisma.timParticipant.createMany({
      data: participantIds.map((userId) => ({
        timId: Number(id),
        userId,
      })),
      skipDuplicates: true,
    });

    // ambil tim setelah update
    const tim = await prisma.tim.findUnique({
      where: { id: Number(id) },
      include: {
        pic: true,
        participants: { include: { user: true } },
      },
    });

    return Response.json(tim, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
