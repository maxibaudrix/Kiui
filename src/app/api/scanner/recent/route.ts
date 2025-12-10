// src/app/api/scanner/recent/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import NextAuth from 'next-auth';ib/auth/auth-options'
import prisma  from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const recentScans = await prisma.productScan.findMany({
      where: { userId: session.user.id },
      orderBy: { scannedAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({
      scans: recentScans.map((scan) => ({
        barcode: scan.barcode,
        productName: scan.productName,
        brand: scan.brand,
        nutriScore: scan.nutriScore,
        novaGroup: scan.novaGroup,
        verdict: scan.verdict,
        calories: scan.calories,
        protein: scan.protein,
        carbs: scan.carbs,
        fats: scan.fats,
        time: scan.scannedAt.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })),
    })
  } catch (error) {
    console.error('Error fetching recent scans:', error)
    return NextResponse.json(
      { error: 'Error al cargar escaneos recientes' },
      { status: 500 }
    )
  }
}