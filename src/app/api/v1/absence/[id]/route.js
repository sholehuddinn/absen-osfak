import prisma from "@/lib/prisma";
export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const absence = await prisma.absence.findUnique({
      where: { id: Number(id) },
      include: {
        pic: true,
        participant: true,
      },
    });

    if (!absence) {
      return Response.json({ error: "Absence not found" }, { status: 404 });
    }

    return Response.json(absence, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const deleted = await prisma.absence.delete({
      where: { id: Number(id) },
      include: {
        pic: true,
        participant: true,
      },
    });

    return Response.json(
      { message: "Absence deleted successfully", deleted },
      { status: 200 }
    );
  } catch (err) {
    if (err.code === "P2025") {
      return Response.json({ error: "Absence not found" }, { status: 404 });
    }

    return Response.json({ error: err.message }, { status: 500 });
  }
}
