/* eslint-disable no-console */
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createCertificate,
  deleteCertificate,
  getCertificateById,
  getCertificates,
  getCertificateSummaryByLeagueMembership,
  getLatestCertificateByLeagueMembership,
  updateCertificate,
} from '../../services/api/endpoints';

export function useGetCertificates({
  filters,
  enabled = true,
  queryKey = ['certificates', filters],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getCertificates(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetCertificateById({
  _id,
  enabled = true,
  queryKey = ['certificate', _id],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getCertificateById(_id),
    enabled: Boolean(_id) && enabled,
    onSuccess,
    onError,
  });
}

export function useGetLatestCertificateByLeagueMembership({
  leagueMembership,
  enabled = true,
  queryKey = ['certificate-latest', leagueMembership],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getLatestCertificateByLeagueMembership(leagueMembership),
    enabled: Boolean(leagueMembership) && enabled,
    onSuccess,
    onError,
  });
}

export function useGetCertificateSummaryByLeagueMembership({
  leagueMembership,
  enabled = true,
  queryKey = ['certificate-summary', leagueMembership],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getCertificateSummaryByLeagueMembership(leagueMembership),
    enabled: Boolean(leagueMembership) && enabled,
    onSuccess,
    onError,
  });
}

export function useCreateCertificate({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: createCertificate,
    onSuccess,
    onError,
  });
}

export function useUpdateCertificate({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: updateCertificate,
    onSuccess,
    onError,
  });
}

export function useDeleteCertificate({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: deleteCertificate,
    onSuccess,
    onError,
  });
}

export function useCertificatesByLeagueMembership({
  filters = {},
  enabled = true,
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey: ['certificates-for-creation', filters],
    queryFn: () => getCertificates(filters),
    enabled,
    onSuccess,
    onError,
  });
}
