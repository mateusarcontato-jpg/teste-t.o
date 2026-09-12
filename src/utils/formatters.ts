export function formatDateBr(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const timeStr = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (isToday) {
      return `Hoje às ${timeStr}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return `Ontem às ${timeStr}`;
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function getSlaRemaining(
  createdAt: string,
  slaHours: number,
  resolvedAt?: string
): { text: string; isBreached: boolean; isWarning: boolean } {
  if (resolvedAt) {
    return { text: 'Atendido no SLA', isBreached: false, isWarning: false };
  }

  const createdTime = new Date(createdAt).getTime();
  const deadlineTime = createdTime + slaHours * 60 * 60 * 1000;
  const now = Date.now();
  const diffHours = (deadlineTime - now) / (1000 * 60 * 60);

  if (diffHours < 0) {
    const overdue = Math.abs(Math.round(diffHours));
    return {
      text: `SLA estourado (${overdue}h)`,
      isBreached: true,
      isWarning: false,
    };
  }

  if (diffHours <= 2) {
    return {
      text: `Resta ${Math.max(1, Math.round(diffHours))}h no SLA`,
      isBreached: false,
      isWarning: true,
    };
  }

  return {
    text: `Meta SLA: ${slaHours}h`,
    isBreached: false,
    isWarning: false,
  };
}
