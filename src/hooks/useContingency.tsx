import { notification } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { useEffect, useState } from 'react';
import ApiHR from '../api/ApiHR';
import { ContingenciesTmHttp, ContingencyHttp } from '../api/interfaces';
import { formatDateApi } from '../helpers';
import { useHandleError } from './useHandleError';
import { CreateContingencyForm } from '../components/form/interfaces';

export const useContingency = () => {
  //table variables
  const [total, setTotal] = useState(0);
  const [isLoadingTable, setIsLoadingTable] = useState(false); // show load table
  const [contingencyRows, setContingencyRows] = useState<ContingencyHttp[]>([]);

  //modal variables
  const [isLoadingRequest, setIsLoadingRequest] = useState(false); // show reject or aprove loader
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [modalOpenRequest, setModalOpenRequest] = useState(false);
  const [folio, setFolio] = useState<string>(''); // created folio

  //data to set folio and id to aprove or reject
  const [contingency, setContingency] = useState<ContingencyHttp>({
    _id: '',
    folio: '',
    id_employee: 0,
    name_employee: '',
    date: '',
    half_day: false,
    status: '',
    comments: '',
    observations: '',
    id_tm: 0,
    createdAt: '',
    updatedAt: '',
    __v: 0,
  });

  //notifications
  const [api, contextHolder] = notification.useNotification();
  const { setServerError } = useHandleError(api);

  const openNotification = (
    placement: NotificationPlacement,
    messages: string | string[],
  ) => {
    api.success({
      message: 'Successful Operation',
      description: messages,
      placement,
    });
  };

  // first request to fill table
  useEffect(() => {
    getContingenciesByPage();
  }, []);

  // functions to CRUD contingencies
  const createContingency = async (data: CreateContingencyForm) => {
    try {
      const submitValues = {
        half_day: data.half_day,
        comments: data.comments,
        date: formatDateApi(data.date),
      };
      setIsLoadingRequest(true);
      const res = await ApiHR.post('/contingencies', submitValues);
      setIsLoadingRequest(false);
      getContingenciesByPage(1);
      setFolio(res.data.folio);
      if (res.data.folio) {
        return true;
      }
    } catch (error: any) {
      setIsLoadingRequest(false);
      setServerError(error);
      return false;
    }
  };

  const getContingenciesByPage = async (page?: number) => {
    try {
      setIsLoadingTable(true);
      const { data } = await ApiHR<ContingenciesTmHttp>(
        `/contingencies?page=${page ?? 1}`,
      );
      setContingencyRows(data.docs);
      setTotal(data.totalDocs);
      setIsLoadingTable(false);
    } catch (error: any) {
      setIsLoadingTable(false);
      setServerError(error);
    }
  };

  const updateContingency = async (values: any) => {
    try {
      setIsLoadingRequest(true);
      await ApiHR.patch(`contingencies/${contingency._id}`, values);
      setIsLoadingRequest(false); //show the loader
      getContingenciesByPage(); // refresh the table
      setModalEdit(false);
      openNotification('top', 'Contingency updated');
    } catch (error: any) {
      setIsLoadingRequest(false);
      setServerError(error);
    }
  };

  const deleteContingency = async () => {
    try {
      setIsLoadingRequest(true);
      await ApiHR.delete(`contingencies/${contingency._id}`);
      setIsLoadingRequest(false); //show the loader
      getContingenciesByPage(); // refresh the table
      setModalDelete(false);
      openNotification('top', 'Contingency deleted');
    } catch (error: any) {
      setIsLoadingRequest(false);
      setServerError(error);
    }
  };

  const setParams = async ({
    record,
    openModal,
  }: {
    record: ContingencyHttp;
    openModal: (param: boolean) => void;
  }) => {
    setContingency(record);
    openModal(true);
  };
  return {
    setParams,
    isLoadingRequest,
    contextHolder,
    setModalOpenRequest,
    setModalInfo,
    setModalEdit,
    setModalDelete,
    contingencyRows,
    total,
    getContingenciesByPage,
    modalOpenRequest,
    createContingency,
    updateContingency,
    deleteContingency,
    isLoadingTable,
    folio,
    contingency,
    modalEdit,
    modalDelete,
    modalInfo,
  };
};