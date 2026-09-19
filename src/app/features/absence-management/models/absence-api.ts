import { AbsenceStatus } from './absence-request';
export interface AbsenceCreateRequest {
  type: string;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  reason: string;
}
export interface AbsenceResponse extends AbsenceCreateRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  approverId: string;
  approverName: string;
  supportFile: string | null;
  status: AbsenceStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  approvalComment: string | null;
}
