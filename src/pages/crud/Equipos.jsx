import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import {
	Column,
	Toast,
	Button,
	Dialog,
	InputText,
	InputTextarea,
	TabView,
	TabPanel,
	tabHeaderIIespanol,
	tabHeaderIIingles,
	Dropdown,
} from "../../components/crud";
import { Conexion } from "../../service/Conexion";
import {
	TablaDatos,
	BarraSuperior,
	EliminarVentana,
	productDialogFooter,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { setDataSet, setFormData } from "../../store/appSlice";
import { Cargando } from "../../components/crud/Cargando";
// import { ImagenCampo } from "../../components/crud/ImagenCampo";

// leonardo

export const Equipos = () => {
	const TABLA = "equipos";
	let emptyFormData = {};
	const { dataSet, formData } = useSelector((state) => state.appsesion); //datos el storage redux
	const dispatch = useDispatch();
	const [productDialog, setProductDialog] = useState(false);
	const [deleteProductDialog, setDeleteProductDialog] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const toast = useRef(null);
	const [recargar, setrecargar] = useState(0);
	const [cargando, setCargando] = useState(false);
	const datatable = new Conexion();
	const [
		dropdowvnDepartamentos,
		setdropdowndropdowvnDepartamentos,
	] = useState(null);

	const [
		dropdowndropdowvntiposistema,
		setdropdowndropdowvntiposistema,
	] = useState(null);
	const [dropdowvnMunicipios, setdropdowvnMunicipios] = useState(null);
	const [listaMunicipios, setlistaMunicipios] = useState(null);
	let tituloiter = "Tipo Equipo";

	useEffect(() => {
		//cargar la data total
		setCargando(true);
		dispatch(setFormData(emptyFormData));

		datatable.gettable(TABLA).then((data) => {
			dispatch(setDataSet(data));
			setCargando(false);
		});
		datatable
			.gettable("parametros/tiposistema")
			.then((menu) => setdropdowndropdowvntiposistema(menu));
	}, [recargar]);

	useEffect(() => {
		if (formData.cod_ciu_sed) {
			setdropdowvnMunicipios(
				listaMunicipios.filter(
					(item) => item.id_dep_mun === formData.cod_ciu_sed
				)
			);
		}
	}, [formData.cod_ciu_sed]);

	/*eventos*/
	const openNew = () => {
		dispatch(setFormData(emptyFormData));
		setSubmitted(false);
		setProductDialog(true);
	};
	const hideDialog = () => {
		setSubmitted(false);
		setProductDialog(false);
	};

	const hideDeleteProductDialog = () => {
		setDeleteProductDialog(false);
	};

	const editProduct = (id) => {
		setCargando(true);
		datatable
			.getItem(TABLA, id)
			.then((data) => dispatch(setFormData({ ...data.data })));
		setProductDialog(true);
		setCargando(false);
	};

	const confirmDeleteProduct = (fila) => {
		dispatch(setFormData(fila));
		setDeleteProductDialog(true);
	};
	const trasaccionExitosa = (tipo = "") => {
		setrecargar(recargar + 1);
		tipo === "borrar" ? setDeleteProductDialog(false) : hideDialog();
		dispatch(setFormData(emptyFormData));

		toast.current.show({
			severity: "success",
			summary: "Confirmacion",
			detail: "Transacción Exitosa",
			life: 4000,
		});
	};

	/*eventos*/

	/**operacion transacciones */
	const saveProduct = () => {
		// console.log("save");
		// console.log(formData.nom_cli);
		setSubmitted(true);
		if (formData.nom_teq?.trim()) {
			// console.log(formData);
			// debugger
			setCargando(true);
			if (formData.id == null) {
				//nuevo registro
				datatable
					.getCrearItem(TABLA, formData)
					.then((data) => trasaccionExitosa());
			} else {
				//editar registro
				datatable
					.getEditarItem(TABLA, formData, formData.id)
					.then((data) => trasaccionExitosa());
			}
		}
	};
	const deleteProduct = () =>
		datatable
			.getEliminarItem(TABLA, formData, formData.id)
			.then((data) => trasaccionExitosa("borrar"));
	/**operacion transacciones */

	/* validaciones de campos */
	const onInputChange = (e, name) => {
		// console.log(e.target, e.target.value, name);
		const val = (e.target && e.target.value) || "";
		let _product = { ...formData };
		_product[`${name}`] = val;
		// _product[`${"tip_not"}`] = grupo; //solo para guardar noticias
		// console.log(_product);
		dispatch(setFormData(_product));
	};

	const actionBodyTemplate = (rowData) => {
		return (
			<div
				className='actions'
				style={{
					display: "flex",
				}}>
				<Button
					icon='pi pi-pencil'
					className='p-button-rounded p-button-success mr-2'
					onClick={() => editProduct(rowData.id)}
				/>
				<Button
					icon='pi pi-trash'
					className='p-button-rounded p-button-warning mr-2'
					onClick={() => confirmDeleteProduct(rowData)}
				/>
			</div>
		);
	};

	return (
		<div className='grid'>
			<div className='col-12'>
				<div className='card'>
					<Cargando cargando={cargando} />
					<Toast ref={toast} />
					<BarraSuperior openNew={openNew} />
					<TablaDatos datostabla={dataSet} titulo={tituloiter}>
						<Column
							field='nom_equ'
							header='Nombre'
							sortable
							headerStyle={{
								width: "25%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='nom_teq'
							header='Tipo'
							sortable
							headerStyle={{
								width: "10%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='nom_tsi'
							header='Ciudad'
							sortable
							headerStyle={{
								width: "10%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='dma_teq'
							header='Monitoreo'
							sortable
							headerStyle={{
								width: "10%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='nom_teq'
							header='Estado'
							sortable
							headerStyle={{
								width: "10%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='dma_teq'
							header='cliente'
							sortable
							headerStyle={{
								width: "25%",
								minWidth: "10rem",
							}}></Column>

						<Column
							header='Acciones'
							body={actionBodyTemplate}></Column>
					</TablaDatos>

					<Dialog
						visible={productDialog}
						style={{ width: "850px" }}
						header={"Detalle " + tituloiter}
						modal={true}
						className='p-fluid'
						footer={productDialogFooter(hideDialog, saveProduct)}
						onHide={hideDialog}>
						<TabView>
							<TabPanel
								className='justify-content: flex-end;'
								headerTemplate={tabHeaderIIespanol}>
								<div className='formgrid grid'>
									<div className='field col'>
										{/* <pre>{JSON.stringify(formData,2)}</pre> */}
										<label htmlFor='nom_teq'>Nombre:</label>
										<InputText
											id='nom_teq'
											value={formData.nom_teq}
											onChange={(e) =>
												onInputChange(e, "nom_teq")
											}
											required
											autoFocus
											className={classNames({
												"p-invalid":
													submitted &&
													!formData.nom_teq,
											})}
										/>
										{submitted && !formData.nom_teq && (
											<small className='p-invalid'>
												Campo requerido.
											</small>
										)}
									</div>
								</div>

								<div className='formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='cod_tsi_teq'>
											Tipo de sistema:
										</label>
										<Dropdown
											value={formData.cod_tsi_teq}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														cod_tsi_teq: e.value,
													})
												);
											}}
											options={
												dropdowndropdowvntiposistema
											}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
									<div className='field col '>
										<label htmlFor='dma_teq'>
											Dias Mantenimiento:
										</label>
										<InputText
											id='dma_teq'
											value={formData.dma_teq}
											onChange={(e) =>
												onInputChange(e, "dma_teq")
											}
										/>
									</div>
								</div>
							</TabPanel>
						</TabView>
					</Dialog>
					<EliminarVentana
						deleteProductDialog={deleteProductDialog}
						product={formData.tit_not}
						hideDeleteProductDialog={hideDeleteProductDialog}
						deleteProduct={deleteProduct}
					/>
				</div>
			</div>
		</div>
	);
};
