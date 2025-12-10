// src/app/api/nutrition/log/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import NextAuth from 'next-auth';ib/auth/auth-options'
import prisma  from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      barcode,
      productName,
      quantity = 1,
      calories,
      protein,
      carbs,
      fats,
      mealType = 'snack',
    } = body

    // Validation
    if (!productName || calories === undefined || protein === undefined || carbs === undefined || fats === undefined) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Create nutrition log
    const log = await prisma.nutritionLog.create({
      data: {
        userId: session.user.id,
        date: today,
        mealType,
        productName,
        barcode,
        calories,
        protein,
        carbs,
        fats,
        quantity,
        unit: 'serving',
      },
    })

    // Update daily totals (you might want to cache this)
    const todayLogs = await prisma.nutritionLog.findMany({
      where: {
        userId: session.user.id,
        date: today,
      },
    })

    const totals = todayLogs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fats: acc.fats + log.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )

    return NextResponse.json({
      success: true,
      log: {
        id: log.id,
        productName: log.productName,
        mealType: log.mealType,
        calories: log.calories,
        protein: log.protein,
        carbs: log.carbs,
        fats: log.fats,
      },
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fats: Math.round(totals.fats),
      },
    })
  } catch (error) {
    console.error('Error creating nutrition log:', error)
    return NextResponse.json(
      { error: 'Error al añadir al diario' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    // Parse date or use today
    const date = dateParam ? new Date(dateParam) : new Date()
    date.setHours(0, 0, 0, 0)

    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    // Get logs for the specified date
    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: date,
          lt: nextDay,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Group by meal type
    const groupedLogs = logs.reduce((acc, log) => {
      if (!acc[log.mealType]) {
        acc[log.mealType] = []
      }
      acc[log.mealType].push({
        id: log.id,
        productName: log.productName,
        barcode: log.barcode,
        calories: log.calories,
        protein: log.protein,
        carbs: log.carbs,
        fats: log.fats,
        quantity: log.quantity,
        unit: log.unit,
        time: log.createdAt.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
      return acc
    }, {} as Record<string, any[]>)

    // Calculate totals
    const totals = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fats: acc.fats + log.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )

    return NextResponse.json({
      date: date.toISOString(),
      logs: groupedLogs,
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fats: Math.round(totals.fats),
      },
    })
  } catch (error) {
    console.error('Error fetching nutrition logs:', error)
    return NextResponse.json(
      { error: 'Error al cargar el diario' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const logId = searchParams.get('id')

    if (!logId) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      )
    }

    // Verify ownership
    const log = await prisma.nutritionLog.findUnique({
      where: { id: logId },
    })

    if (!log || log.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Delete log
    await prisma.nutritionLog.delete({
      where: { id: logId },
    })

    return NextResponse.json({
      success: true,
      message: 'Entrada eliminada',
    })
  } catch (error) {
    console.error('Error deleting nutrition log:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la entrada' },
      { status: 500 }
    )
  }
}