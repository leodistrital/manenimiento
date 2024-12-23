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

export const SedeClientes = () => {
	const TABLA = "sedes";
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

	const [dropdowvnClientes, setdropdowndropdowvnClientes] = useState(null);
	const [dropdowvnMunicipios, setdropdowvnMunicipios] = useState(null);
	const [listaMunicipios, setlistaMunicipios] = useState(null);
	let tituloiter = "Sedes";

	useEffect(() => {
		//cargar la data total
		setCargando(true);
		dispatch(setFormData(emptyFormData));

		datatable.gettable(TABLA).then((data) => {
			dispatch(setDataSet(data));
			setCargando(false);
		});

		datatable
			.gettable("parametros/departamentos")
			.then((menu) => setdropdowndropdowvnDepartamentos(menu));

		datatable
			.gettable("parametros/cliente")
			.then((menu) => setdropdowndropdowvnClientes(menu));

		datatable
			.gettable("parametros/municipios")
			.then((menu) => setlistaMunicipios(menu));
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
		if (formData.nom_sed?.trim()) {
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
							field='nom_sed'
							header='Nombre'
							sortable
							headerStyle={{
								width: "30%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='nom_cli'
							header='Cliente'
							sortable
							headerStyle={{
								width: "40%",
								minWidth: "10rem",
							}}></Column>

						<Column
							field='nom_mun'
							header='Ciudad'
							sortable
							headerStyle={{
								width: "10%",
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
										<label htmlFor='nom_sed'>Nombre:</label>
										<InputText
											id='nom_sed'
											value={formData.nom_sed}
											onChange={(e) =>
												onInputChange(e, "nom_sed")
											}
											required
											autoFocus
											className={classNames({
												"p-invalid":
													submitted &&
													!formData.nom_sed,
											})}
										/>
										{submitted && !formData.nom_sed && (
											<small className='p-invalid'>
												Campo requerido.
											</small>
										)}
									</div>
								</div>

								<div className='formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='tel_sed'>
											Telefono:
										</label>
										<InputText
											id='tel_sed'
											value={formData.tel_sed}
											onChange={(e) =>
												onInputChange(e, "tel_sed")
											}
										/>
									</div>
									<div className='field col '>
										<label htmlFor='dir_sed'>
											Direccin:
										</label>
										<InputText
											id='dir_sed'
											value={formData.dir_sed}
											onChange={(e) =>
												onInputChange(e, "dir_sed")
											}
										/>
									</div>
								</div>
								<div className='formgrid grid'>
									<div className='field col-4'>
										<label htmlFor='cod_cli_sed'>
											Cliente:
										</label>
										<Dropdown
											value={formData.cod_cli_sed}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														cod_cli_sed: e.value,
													})
												);
											}}
											options={dropdowvnClientes}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
									<div className='field col '>
										<label htmlFor='cod_ciu_sed'>
											Departamento:
										</label>
										<Dropdown
											value={formData.cod_ciu_sed}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														cod_ciu_sed: e.value,
													})
												);
											}}
											options={dropdowvnDepartamentos}
											optionLabel='name'
											placeholder='Seleccione'
										/>
									</div>
									<div className='field col '>
										<label htmlFor='cod_mun_sed'>
											Ciudad:
										</label>
										<Dropdown
											value={formData.cod_mun_sed}
											onChange={(e) => {
												dispatch(
													setFormData({
														...formData,
														cod_mun_sed: e.value,
													})
												);
											}}
											options={dropdowvnMunicipios}
											optionLabel='name'
											placeholder='Seleccione'
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
