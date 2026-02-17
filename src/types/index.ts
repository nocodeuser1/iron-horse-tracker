export type ActionType =
  | 'Event Actions'
  | 'Inspections'
  | 'Samples'
  | 'Tests'
  | 'Throughput Reports';

export type RecurrencePattern =
  | 'Per Event'
  | 'Initial'
  | 'Continual'
  | 'Monthly'
  | 'Quarterly'
  | 'Semi-Annual'
  | 'Annual'
  | 'Initial / Annual'
  | 'Initial / Quarterly'
  | 'Initial / Biannual (Every 2 Years)';

export type EquipmentType =
  | 'Compressor'
  | 'Storage Tank'
  | 'Flare'
  | 'Dehydrator'
  | 'Heater'
  | 'Thermal Oxidizer'
  | 'Amine Unit'
  | 'Engine'
  | 'Generator'
  | 'General';

export type RequirementStatus = 'completed' | 'pending' | 'overdue';

export interface PermitRequirement {
  id: string;
  typeOfAction: ActionType;
  recurrence: RecurrencePattern | string;
  action: string;
  requirementsCovered: string;
  neededBy: string | null;
  completedDate: string | null;
  fileUploaded: string | null;
  equipmentType: EquipmentType;
}

export interface DashboardMetrics {
  totalRequirements: number;
  dueThisMonth: number;
  overdue: number;
  complianceScore: number;
}

export interface FilterState {
  actionTypes: ActionType[];
  recurrencePatterns: string[];
  equipmentTypes: EquipmentType[];
  statuses: RequirementStatus[];
  searchQuery: string;
  dateRange: { start: string | null; end: string | null };
}
