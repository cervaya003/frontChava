import { Component, OnInit } from '@angular/core';
import { Peticiones, Persona } from '../../services/peticiones.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.page.html',
  styleUrls: ['./personas.page.scss'],
  standalone: false
})
export class PersonasPage implements OnInit {
  personas: Persona[] = [];
  cargando: boolean = false;

  constructor(
    private peticiones: Peticiones,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarPersonas();
  }

  async cargarPersonas() {
    this.cargando = true;
    
    this.peticiones.getPersonas().subscribe({
      next: (data: any) => {
        this.personas = data || [];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando personas:', error);
        this.cargando = false;
        this.mostrarError('Error al cargar las personas: ' + error.message);
      }
    });
  }

  async agregarPersona() {
    const nombre = prompt('Nombre completo:');
    if (!nombre) return;

    const email = prompt('Email:');
    if (!email) return;

    const telefono = prompt('Teléfono:') || '';
    const edadInput = prompt('Edad:') || '0';
    const edad = parseInt(edadInput);

    if (!this.validarDatos({ nombre, email, telefono, edad })) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creando persona...'
    });
    await loading.present();

    this.peticiones.createPersona({ nombre, email, telefono, edad }).subscribe({
      next: (response) => {
        loading.dismiss();
        this.mostrarMensaje('Persona creada exitosamente');
        this.cargarPersonas();
      },
      error: (error) => {
        loading.dismiss();
        this.mostrarError('Error al crear la persona: ' + error.message);
      }
    });
  }

  async editarPersona(persona: Persona) {
    const nombre = prompt('Nombre completo:', persona.nombre);
    if (!nombre) return;

    const email = prompt('Email:', persona.email);
    if (!email) return;

    const telefono = prompt('Teléfono:', persona.telefono) || '';
    const edadInput = prompt('Edad:', persona.edad.toString()) || '0';
    const edad = parseInt(edadInput);

    if (!this.validarDatos({ nombre, email, telefono, edad })) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Actualizando persona...'
    });
    await loading.present();

    this.peticiones.updatePersona(persona._id!, { nombre, email, telefono, edad }).subscribe({
      next: (response) => {
        loading.dismiss();
        this.mostrarMensaje('Persona actualizada exitosamente');
        this.cargarPersonas();
      },
      error: (error) => {
        loading.dismiss();
        this.mostrarError('Error al actualizar la persona: ' + error.message);
      }
    });
  }

  async eliminarPersona(id: string) {
    const confirmar = confirm('¿Estás seguro de que quieres eliminar esta persona? Esta acción no se puede deshacer.');
    
    if (!confirmar) return;

    const loading = await this.loadingController.create({
      message: 'Eliminando persona...'
    });
    await loading.present();

    this.peticiones.deletePersona(id).subscribe({
      next: (response) => {
        loading.dismiss();
        this.mostrarMensaje('Persona eliminada exitosamente');
        this.cargarPersonas();
      },
      error: (error) => {
        loading.dismiss();
        this.mostrarError('Error al eliminar la persona: ' + error.message);
      }
    });
  }

  validarDatos(data: any): boolean {
    if (!data.nombre || data.nombre.trim() === '') {
      this.mostrarError('El nombre es obligatorio');
      return false;
    }
    
    if (!data.email || data.email.trim() === '') {
      this.mostrarError('El email es obligatorio');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.mostrarError('Por favor ingresa un email válido');
      return false;
    }

    if (data.edad < 0 || data.edad > 120) {
      this.mostrarError('La edad debe estar entre 0 y 120 años');
      return false;
    }

    return true;
  }

  async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 4000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  async recargar(event: any) {
    await this.cargarPersonas();
    event.target.complete();
  }
}