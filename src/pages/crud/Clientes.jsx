import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

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
import { ImagenCampo } from "../../components/crud/ImagenCampo";

// leonardo

export const Clientes = () => {
	const TABLA = "cliente";
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
	const [dropdownTipoAliado, setdropdownTipoAliado] = useState(null);
	let tituloiter = "Clientes";
	// let { grupo } = useParams();
	// if (grupo == 1) tituloiter = "Noticias";
	// if (grupo == 3) tituloiter = "Recomendaciones";
	// if (grupo == 2) tituloiter = "Destacados";
	// console.log({ grupo }, { tituloiter });

	useEffect(() => {
		//cargar la data total
		setCargando(true);
		dispatch(setFormData(emptyFormData));

		datatable.gettable(TABLA).then((data) => {
			dispatch(setDataSet(data));
			setCargando(false);
		});
	}, [recargar]);

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
		if (formData.nom_cli?.trim()) {
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
							field='nom_cli'
							header='Nombre'
							sortable
							headerStyle={{
								width: "60%",
								minWidth: "10rem",
							}}></Column>
						<Column
							field='nit_cli'
							header='NIT'
							sortable
							headerStyle={{
								width: "30%",
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
										<label htmlFor='nom_cli'>Nombre:</label>
										<InputText
											id='nom_cli'
											value={formData.nom_cli}
											onChange={(e) =>
												onInputChange(e, "nom_cli")
											}
											required
											autoFocus
											className={classNames({
												"p-invalid":
													submitted &&
													!formData.nom_cli,
											})}
										/>
										{submitted && !formData.nom_cli && (
											<small className='p-invalid'>
												Campo requerido.
											</small>
										)}
									</div>
								</div>

								<div className='formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='nit_cli'>Nit:</label>
										<InputText
											id='nit_cli'
											value={formData.nit_cli}
											onChange={(e) =>
												onInputChange(e, "nit_cli")
											}
										/>
									</div>
									<div className='field col '>
										<label htmlFor='dir_cli'>
											Direccin:
										</label>
										<InputText
											id='dir_cli'
											value={formData.dir_cli}
											onChange={(e) =>
												onInputChange(e, "dir_cli")
											}
										/>
									</div>
								</div>

								{/* <div className='formgrid grid'>
									<div className='field col'>
										<label htmlFor='ent_not'>
											Descripcion español:
										</label>
										<InputTextarea
											id='ent_not'
											value={formData.ent_not}
											onChange={(e) =>
												onInputChange(e, "ent_not")
											}
											rows={6}
											cols={20}
										/>
									</div>
								</div> */}

								{/* <div className='formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='fue_not'>Fuente:</label>
										<InputText
											id='fue_not'
											value={formData.fue_not}
											onChange={(e) =>
												onInputChange(e, "fue_not")
											}
										/>
									</div>
									<div className='field col '>
										<label htmlFor='lin_not'>Link:</label>
										<InputText
											id='lin_not'
											value={formData.lin_not}
											onChange={(e) =>
												onInputChange(e, "lin_not")
											}
										/>
									</div>
								</div> */}

								{/* <div className='formgrid grid'>
									<div className='field col-6'>
										<label htmlFor='fec_not'>Fecha:</label>
										<InputText
											id='fec_not'
											value={formData.fec_not}
											onChange={(e) =>
												onInputChange(e, "fec_not")
											}
										/>
									</div>
									<div className='field col-6'>
										<label htmlFor='ord_not'>Orden:</label>
										<InputText
											id='ord_not'
											value={formData.ord_not}
											onChange={(e) =>
												onInputChange(e, "ord_not")
											}
										/>
									</div>
								</div> */}

								{/* <div className='formgrid grid'>
									<div className='field col hidden '>
										<label htmlFor='grupo'>grupo:</label>
										<InputText id='grupo' value={grupo} />
									</div>
								</div> */}

								<div className='field'>
									<ImagenCampo
										label='Logo'
										formData={formData}
										CampoImagen='log_nit'
										nombreCampo='demo'
										edicampo={formData.log_nit}
										urlupload='/upload/images/matenimiento'
									/>
								</div>
							</TabPanel>
							{/* <TabPanel headerTemplate={tabHeaderIIingles}>
								<div className='field col'>
									<label htmlFor='tit_not_ing'>
										Titulo ingles:
									</label>
									<InputText
										id='tit_not_ing'
										value={formData.tit_not_ing}
										onChange={(e) =>
											onInputChange(e, "tit_not_ing")
										}
									/>
								</div>
								<div className='field col'>
									<label htmlFor='ent_not_ing'>
										Descripcion ingles:
									</label>
									<InputTextarea
										id='ent_not_ing'
										value={formData.ent_not_ing}
										onChange={(e) =>
											onInputChange(e, "ent_not_ing")
										}
										required
										rows={6}
										cols={20}
									/>
								</div>
							</TabPanel> */}
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
