import { db } from "@/lib/db/client";
import { auditLogs } from "./schema";
import { eq, and, desc } from "drizzle-orm";

export async function logAudit(input: {
  userId?: string;
  organizationId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}) {
  const [log] = await db
    .insert(auditLogs)
    .values({
      userId: input.userId,
      organizationId: input.organizationId,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId,
      description: input.description,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      metadata: input.metadata,
    })
    .returning();

  return log;
}

export async function getAuditLogs(input: {
  organizationId?: string;
  userId?: string;
  action?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = input.page || 1;
  const pageSize = input.pageSize || 20;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (input.organizationId) conditions.push(eq(auditLogs.organizationId, input.organizationId));
  if (input.userId) conditions.push(eq(auditLogs.userId, input.userId));
  if (input.action) conditions.push(eq(auditLogs.action, input.action));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [logs, countResult] = await Promise.all([
    db.query.auditLogs.findMany({
      where,
      orderBy: desc(auditLogs.createdAt),
      limit: pageSize,
      offset,
    }),
    db.query.auditLogs.findMany({ where, columns: { id: true } }),
  ]);

  return {
    data: logs,
    pagination: {
      page,
      pageSize,
      total: countResult.length,
      totalPages: Math.ceil(countResult.length / pageSize),
    },
  };
}
