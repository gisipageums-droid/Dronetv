import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AdminFormRootState, AdminFormDispatch } from './index';

export const useAdminFormDispatch: () => AdminFormDispatch = useDispatch;
export const useAdminFormSelector: TypedUseSelectorHook<AdminFormRootState> = useSelector;


