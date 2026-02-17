import type { PermitRequirement, RequirementStatus, DashboardMetrics } from '../../types';

export function getStatus(req: PermitRequirement): RequirementStatus {
  if (req.completedDate) return 'completed';
  if (!req.neededBy) return 'pending';
  const now = new Date();
  const due = new Date(req.neededBy);
  return due < now ? 'overdue' : 'pending';
}

export function getMetrics(requirements: PermitRequirement[]): DashboardMetrics {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const dueThisMonth = requirements.filter((r) => {
    if (!r.neededBy) return false;
    const d = new Date(r.neededBy);
    return d >= monthStart && d <= monthEnd;
  }).length;

  const overdue = requirements.filter((r) => getStatus(r) === 'overdue').length;

  const withDueDate = requirements.filter((r) => r.neededBy);
  const completedOnTime = withDueDate.filter((r) => {
    if (!r.completedDate || !r.neededBy) return false;
    return new Date(r.completedDate) <= new Date(r.neededBy);
  }).length;

  const complianceScore = withDueDate.length > 0
    ? Math.round((completedOnTime / withDueDate.length) * 100)
    : 100;

  return {
    totalRequirements: requirements.length,
    dueThisMonth,
    overdue,
    complianceScore,
  };
}
