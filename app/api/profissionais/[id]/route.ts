import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// DELETE: Remove a professional by ID
export async function DELETE(req: Request, { params }: any) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    await prisma.profissional.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir profissional:', error)
    return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 })
  }
}


// PUT: Updates a professional's data by ID
export async function PUT(req: Request, { params }: any) {

  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const data = await req.json()

    const updated = await prisma.profissional.update({
      where: { id },
      data: {
        nome: data.nome,
        andar: data.andar,
        sala: data.sala,
        telefone: data.telefone,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}
