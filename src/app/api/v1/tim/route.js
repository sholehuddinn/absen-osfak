import prisma from "@/lib/prisma";

// GET tim (semua atau filter by ?pic=nim)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const picNim = searchParams.get("pic");

    let tims;

    if (picNim) {
      // cari tim berdasarkan NIM PIC
      tims = await prisma.tim.findMany({
        where: { pic: { nim: picNim } },
        include: {
          pic: true,
          participants: { include: { user: true } },
        },
      });
    } else {
      // ambil semua tim
      tims = await prisma.tim.findMany({
        include: {
          pic: true,
          // participants: { include: { user: true } },
        },
      });
    }

    return Response.json(tims, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST tim baru
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, picId, participantIds } = body;

    if (!name || !picId) {
      return Response.json(
        { error: "Nama tim dan PIC wajib diisi" },
        { status: 400 }
      );
    }

    // Buat tim baru + PIC
    const tim = await prisma.tim.create({
      data: {
        name,
        pic: { connect: { id: picId } },
      },
    });

    // Tambahkan participants kalau ada
    if (participantIds?.length > 0) {
      await prisma.timParticipant.createMany({
        data: participantIds.map((userId) => ({
          timId: tim.id,
          userId,
        })),
        skipDuplicates: true,
      });
    }

    // Ambil ulang dengan relasi
    const timWithParticipants = await prisma.tim.findUnique({
      where: { id: tim.id },
      include: {
        pic: true,
        participants: { include: { user: true } },
      },
    });

    return Response.json(timWithParticipants, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
