// src/app/api/dashboard/route.ts
import { NextResponse } from 'next/server'
import NextAuth from 'next-auth';
import prisma  from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      )
    }

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get today's nutrition logs
    const todayLogs = await prisma.nutritionLog.findMany({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    // Calculate today's totals
    const todayStats = todayLogs.reduce(
      (acc, log) => ({
        consumedCalories: acc.consumedCalories + log.calories,
        consumedProtein: acc.consumedProtein + log.protein,
        consumedCarbs: acc.consumedCarbs + log.carbs,
        consumedFats: acc.consumedFats + log.fats,
      }),
      {
        consumedCalories: 0,
        consumedProtein: 0,
        consumedCarbs: 0,
        consumedFats: 0,
      }
    )

    // Get recent scans (last 5)
    const recentScans = await prisma.productScan.findMany({
      where: { userId },
      orderBy: { scannedAt: 'desc' },
      take: 5,
    })

    // Get today's workout
    const todayWorkout = await prisma.workout.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    // Get weekly progress (last 7 days)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 6)

    const weeklyLogs = await prisma.nutritionLog.groupBy({
      by: ['date'],
      where: {
        userId,
        date: {
          gte: weekAgo,
          lt: tomorrow,
        },
      },
      _sum: {
        calories: true,
      },
    })

    // Format weekly progress
    const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekAgo)
      date.setDate(date.getDate() + i)
      const dayData = weeklyLogs.find(
        (log) => log.date.toDateString() === date.toDateString()
      )
      
      return {
        day: ['D', 'L', 'M', 'X', 'J', 'V', 'S'][date.getDay()],
        calories: dayData?._sum.calories || 0,
        completed: dayData?._sum.calories ? dayData._sum.calories >= profile.targetCalories * 0.9 : false,
      }
    })

    // Calculate streak
    const streak = await calculateStreak(userId)

    return NextResponse.json({
      profile: {
        targetCalories: profile.targetCalories,
        targetProtein: profile.targetProtein,
        targetCarbs: profile.targetCarbs,
        targetFats: profile.targetFats,
        currentWeight: profile.weight,
        targetWeight: profile.targetWeight || profile.weight,
        goal: profile.goal,
      },
      todayStats: {
        consumedCalories: Math.round(todayStats.consumedCalories),
        consumedProtein: Math.round(todayStats.consumedProtein),
        consumedCarbs: Math.round(todayStats.consumedCarbs),
        consumedFats: Math.round(todayStats.consumedFats),
      },
      recentScans: recentScans.map((scan) => ({
        id: scan.id,
        productName: scan.productName,
        time: scan.scannedAt.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        nutriScore: scan.nutriScore,
        verdict: scan.verdict,
      })),
      todayWorkout: todayWorkout ? {
        scheduled: true,
        type: todayWorkout.type,
        duration: todayWorkout.duration,
        caloriesBurned: todayWorkout.caloriesBurned || 0,
        completed: todayWorkout.completed,
      } : null,
      weeklyProgress,
      streak,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Error al cargar el dashboard' },
      { status: 500 }
    )
  }
}

async function calculateStreak(userId: string): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  let currentDate = new Date(today)

  while (true) {
    const nextDay = new Date(currentDate)
    nextDay.setDate(nextDay.getDate() + 1)

    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId,
        date: {
          gte: currentDate,
          lt: nextDay,
        },
      },
    })

    if (logs.length === 0) break

    streak++
    currentDate.setDate(currentDate.getDate() - 1)

    // Safety limit
    if (streak > 365) break
  }

  return streak
}