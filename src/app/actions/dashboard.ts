"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getDashboardMetrics() {
  const session = await auth();
  const tenantId = session?.user?.tenantId;

  if (!tenantId) {
    return {
      revenue: 0,
      ordersPending: 0,
      visits: 0,
      mpConnected: false,
    };
  }

  // Verificar si MP está conectado
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { mpAccessToken: true, theme: true, status: true, plan: true },
  });

  // Calcular ingresos totales (órdenes pagadas)
  const paidOrders = await prisma.order.findMany({
    where: {
      tenantId,
      status: "PAID",
    },
    select: {
      total: true,
    },
  });

  const revenue = paidOrders.reduce((acc, order) => acc + order.total, 0);

  // Calcular pedidos pagados
  const paidOrdersCount = await prisma.order.count({
    where: {
      tenantId,
      status: "PAID",
    },
  });

  // Ventas por fecha (últimos 7 días)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const salesByDate = await Promise.all(
    last7Days.map(async (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const daySales = await prisma.order.aggregate({
        where: {
          tenantId,
          status: "PAID",
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
        _sum: {
          total: true,
        },
      });

      return {
        date: date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
        total: daySales._sum.total || 0,
      };
    })
  );

  return {
    revenue,
    ordersPending: paidOrdersCount,
    visits: 0, 
    mpConnected: !!tenant?.mpAccessToken,
    status: tenant?.status || "ACTIVE",
    plan: tenant?.plan || "FREE",
    salesHistory: salesByDate
  };
}
