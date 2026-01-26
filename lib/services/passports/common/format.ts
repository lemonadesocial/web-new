import { format } from 'date-fns';

export const formatDate = (date: Date, dateFormat = 'MM/dd/yyyy') => format(date, dateFormat);
