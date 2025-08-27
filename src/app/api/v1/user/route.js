import prisma from "@/lib/prisma";
export const runtime = "nodejs"; 

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

    const kodeJurusan = nim.substring(6, 8); 

    let prodi = "";
    switch (kodeJurusan) {
      case "41":
        prodi = "Teknik Sipil";
        break;
      case "42":
        prodi = "Teknik Informatika";
        break;
      case "43":
        prodi = "Teknik Geomatika";
        break;
      default:
        prodi = "Tidak Diketahui"; 
        break;
    }

    const user = await prisma.user.create({
      data: { nim, name, role, prodi },
    });

    return Response.json(user, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
