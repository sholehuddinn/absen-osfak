import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { absences: true, participants: true },
    });
    return Response.json(users, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nim, name, role } = body;

    const user = await prisma.user.create({
      data: { nim, name, role },
    });

    return Response.json(user, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
