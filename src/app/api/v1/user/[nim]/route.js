import prisma from "@/lib/prisma";
export const runtime = "nodejs"; 

export async function GET(req, { params }) {
  try {
    const { nim } = await params;

    const user = await prisma.user.findUnique({
      where: { nim },
      include: {
        absences: true,
        participants: true,
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
