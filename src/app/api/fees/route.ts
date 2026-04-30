import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'studentId is required' },
        { status: 400 }
      )
    }

    const invoices = await db.feeInvoice.findMany({
      where: { studentId },
      include: {
        structure: {
          select: {
            id: true,
            name: true,
            type: true,
            currency: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount,
      paid: invoice.paid,
      remaining: invoice.amount - invoice.paid,
      dueDate: invoice.dueDate,
      status: invoice.status,
      installmentNum: invoice.installmentNum,
      structure: invoice.structure,
      payments: invoice.payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        method: payment.method,
        transactionId: payment.transactionId,
        status: payment.status,
        createdAt: payment.createdAt,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    }))

    // Summary stats
    const totalAmount = invoices.reduce((sum, i) => sum + i.amount, 0)
    const totalPaid = invoices.reduce((sum, i) => sum + i.paid, 0)
    const totalRemaining = totalAmount - totalPaid
    const pendingInvoices = invoices.filter((i) => i.status === 'Pending').length
    const paidInvoices = invoices.filter((i) => i.status === 'Paid').length

    return NextResponse.json({
      success: true,
      data: {
        invoices: formattedInvoices,
        summary: {
          totalAmount: Math.round(totalAmount * 100) / 100,
          totalPaid: Math.round(totalPaid * 100) / 100,
          totalRemaining: Math.round(totalRemaining * 100) / 100,
          pendingInvoices,
          paidInvoices,
          totalInvoices: invoices.length,
        },
      },
    })
  } catch (error) {
    console.error('Fees API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fee data' },
      { status: 500 }
    )
  }
}
