import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET → Lista todos os profissionais
export async function GET() {
  const profissionais = await prisma.profissional.findMany({
    orderBy: { nome: 'asc' },
  })
  return NextResponse.json(profissionais)
}

// POST → Cadastra novo profissional
export async function POST(req: Request) {
  const data = await req.json()

  const novo = await prisma.profissional.create({
    data: {
      nome: data.nome,
      andar: data.andar,
      sala: data.sala,
      telefone: data.telefone,
    },
  })

  return NextResponse.json(novo, { status: 201 })
}
