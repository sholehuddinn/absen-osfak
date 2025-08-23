export function GET() {
  return Response.json({ message: "API is running",  status: 200, version: "1" });
}