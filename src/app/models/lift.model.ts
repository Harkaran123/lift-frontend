export interface AlertRecipient {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
}

export interface Lift {
  id?: number;
  name: string;
  area: string;
  building: string;
  installationDate: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  maintenanceInterval: number;
  nextMaintenanceDate?: string;
  reminderSettings?: ReminderSetting[];
}

export interface ReminderSetting {
  id?: number;
  lift?: Lift;
  reminderTiming: number;
  notificationMethod: string;
}
