import { format } from 'date-fns';

const dateFormat = 'MM/dd/yyyy';

export const formatDate = (date: Date) => format(date, dateFormat);
