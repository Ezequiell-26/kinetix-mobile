import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getClientForSession(){
  const s = await getSession();
  if(!s) return null;
  if(s.role==="TRAINER") return null; // trainers don't have client row for themselves in this context
  // Find client by userId or email
  const client = await prisma.client.findFirst({
    where: { OR: [{userId: s.id}, {email: s.email}] },
    include: { assignedProgram: true, subscription: true },
  });
  return { session: s, client };
}

export async function requireClient(){
  const res = await getClientForSession();
  if(!res || !res.client) return null;
  return res;
}
