/**
 * Data synchronization across tabs
 * Allows data changes (like new students, courses) to be reflected in all tabs
 * WITHOUT affecting authentication state
 */

type DataChangeEvent = {
  type: 'student_added' | 'student_updated' | 'student_deleted' |
        'course_added' | 'course_updated' | 'course_deleted' |
        'teacher_added' | 'teacher_updated' | 'teacher_deleted' |
        'enrollment_added' | 'enrollment_deleted' |
        'data_refresh';
  timestamp: number;
  data?: any;
};

type DataChangeListener = (event: DataChangeEvent) => void;

const DATA_SYNC_KEY = 'campushub_data_sync';
const listeners: Set<DataChangeListener> = new Set();

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Broadcast a data change event to all tabs
 */
export function broadcastDataChange(event: Omit<DataChangeEvent, 'timestamp'>) {
  if (!isBrowser) return;
  
  const fullEvent: DataChangeEvent = {
    ...event,
    timestamp: Date.now(),
  };
  
  // Use localStorage to broadcast to other tabs
  // This is different from sessionStorage (which is tab-specific)
  localStorage.setItem(DATA_SYNC_KEY, JSON.stringify(fullEvent));
  
  // Also notify listeners in current tab
  listeners.forEach(listener => listener(fullEvent));
}

/**
 * Listen for data changes from other tabs
 */
export function onDataChange(listener: DataChangeListener) {
  if (!isBrowser) return () => {};
  
  listeners.add(listener);
  
  // Listen for storage events (from other tabs)
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === DATA_SYNC_KEY && e.newValue) {
      try {
        const event: DataChangeEvent = JSON.parse(e.newValue);
        listener(event);
      } catch (error) {
        console.error('[DataSync] Failed to parse data change event:', error);
      }
    }
  };
  
  window.addEventListener('storage', handleStorageEvent);
  
  // Return cleanup function
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

/**
 * Trigger a refresh of specific data type
 */
export function triggerDataRefresh(dataType?: string) {
  broadcastDataChange({
    type: 'data_refresh',
    data: { dataType },
  });
}

/**
 * Notify about student changes
 */
export function notifyStudentChange(action: 'added' | 'updated' | 'deleted', studentData?: any) {
  broadcastDataChange({
    type: `student_${action}` as any,
    data: studentData,
  });
}

/**
 * Notify about course changes
 */
export function notifyCourseChange(action: 'added' | 'updated' | 'deleted', courseData?: any) {
  broadcastDataChange({
    type: `course_${action}` as any,
    data: courseData,
  });
}

/**
 * Notify about teacher changes
 */
export function notifyTeacherChange(action: 'added' | 'updated' | 'deleted', teacherData?: any) {
  broadcastDataChange({
    type: `teacher_${action}` as any,
    data: teacherData,
  });
}

/**
 * Notify about enrollment changes
 */
export function notifyEnrollmentChange(action: 'added' | 'deleted', enrollmentData?: any) {
  broadcastDataChange({
    type: `enrollment_${action}` as any,
    data: enrollmentData,
  });
}
