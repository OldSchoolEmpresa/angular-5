import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ComprasService, Pedido as PedidoCompras } from '../../servicios/compras.service';

interface ColorVariante {
  nombre: string;
  codigo: string;
  imagenes: string[];
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  tiempoEntrega: string;
  colores: ColorVariante[];
}

interface PedidoVenta {
  producto: Producto;
  cantidad: number;
  talla: string;
  colorSeleccionado: ColorVariante;
  imagenActual: string;
  indiceImagen: number;
  fechaEstimada: string;
  usuario: {
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
  };
}

@Component({
  selector: 'app-ventas-jordan',
  templateUrl: './ventas-jordan.component.html',
  styleUrls: ['./ventas-jordan.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ComprasService]
})
export class VentasJordanComponent {
  productoActual: Producto = {
    id: 1,
    nombre: 'Buzo Jordan',
    precio: 200000,
    descripcion: 'Buzo de alta calidad',
    tiempoEntrega: '3-5 días hábiles',
    colores: [
      {
        nombre: 'Rojo',
        codigo: '#f30000',
        imagenes: ['asset/img/Buzo Jordan rojo.jpeg']
      },
      {
        nombre: 'Blanco',
        codigo: '#ffffff',
        imagenes: ['asset/img/Buzo Jordan blanco.jpeg']
      },
      {
        nombre: 'Negro',
        codigo: '#000000',
        imagenes: ['asset/img/Buzo Jordan negro.jpeg']
      },
      {
        nombre: 'Negro Azul',
        codigo: '#002fff',
        imagenes: ['asset/img/jordan negro azul.jpg']
      }
    ]
  };

  pedido: PedidoVenta = {
    producto: this.productoActual,
    cantidad: 1,
    talla: '',
    colorSeleccionado: this.productoActual.colores[0],
    imagenActual: this.productoActual.colores[0].imagenes[0],
    indiceImagen: 0,
    fechaEstimada: '',
    usuario: {
      nombre: '',
      direccion: '',
      telefono: '',
      email: ''
    }
  };

  mostrarConfirmacion = false;
  tallasDisponibles: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private comprasService: ComprasService
  ) {
    this.calcularFechaEntrega();
  }

  seleccionarColor(color: ColorVariante): void {
    this.pedido.colorSeleccionado = color;
    this.pedido.indiceImagen = 0;
    this.pedido.imagenActual = color.imagenes[0];
  }

  cambiarImagen(direccion: number): void {
    const totalImagenes = this.pedido.colorSeleccionado.imagenes.length;
    this.pedido.indiceImagen = (this.pedido.indiceImagen + direccion + totalImagenes) % totalImagenes;
    this.pedido.imagenActual = this.pedido.colorSeleccionado.imagenes[this.pedido.indiceImagen];
  }

  seleccionarImagen(index: number): void {
    this.pedido.indiceImagen = index;
    this.pedido.imagenActual = this.pedido.colorSeleccionado.imagenes[index];
  }

  calcularFechaEntrega(): void {
    const hoy = new Date();
    const diasEntrega = this.pedido.producto.tiempoEntrega.split('-')[0];
    const fechaEntrega = new Date(hoy);
    fechaEntrega.setDate(hoy.getDate() + parseInt(diasEntrega));
    this.pedido.fechaEstimada = fechaEntrega.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  confirmarCompra(): void {
    if (this.pedido.talla && this.pedido.colorSeleccionado) {
      this.mostrarConfirmacion = true;
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor selecciona talla y color',
        confirmButtonColor: '#002fff'
      });
    }
  }

  finalizarCompra(): void {
    if (!this.pedido.talla || !this.pedido.usuario.nombre || !this.pedido.usuario.direccion ||
        !this.pedido.usuario.telefono || !this.pedido.usuario.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, completa todos los campos de usuario y selecciona una talla.',
        confirmButtonColor: '#002fff'
      });
      return;
    }

    const pedidoParaEnviar = {
      producto: this.pedido.producto.nombre,
      color: this.pedido.colorSeleccionado.nombre,
      talla: this.pedido.talla,
      cantidad: this.pedido.cantidad,
      precioUnitario: this.pedido.producto.precio,
      subtotal: this.pedido.producto.precio * this.pedido.cantidad,
      imagen: this.pedido.imagenActual,
      usuario: {
        nombre: this.pedido.usuario.nombre,
        direccion: this.pedido.usuario.direccion,
        telefono: this.pedido.usuario.telefono,
        email: this.pedido.usuario.email
      }
    };

    const url = 'http://localhost/laravel/clase1/clase1/app/modelo/pedido.php';

    this.http.post(url, pedidoParaEnviar).subscribe({
      next: (response: any) => {
        // Preparar datos para el servicio de compras
        const pedidoParaCompras: Omit<PedidoCompras, 'id' | 'estado'> = {
          producto: {
            nombre: this.pedido.producto.nombre,
            precio: this.pedido.producto.precio,
            imagen: this.pedido.imagenActual,
            color: this.pedido.colorSeleccionado.nombre,
            talla: this.pedido.talla
          },
          cantidad: this.pedido.cantidad,
          fecha: new Date().toISOString(),
          fechaEntregaEstimada: this.pedido.fechaEstimada,
          usuario: {
            nombre: this.pedido.usuario.nombre,
            direccion: this.pedido.usuario.direccion,
            email: this.pedido.usuario.email
          },
          total: this.pedido.producto.precio * this.pedido.cantidad
        };

        // Guardar en el servicio de compras
        this.comprasService.agregarCompra(pedidoParaCompras);

        const pedidoParaDetalle = {
          numero: 'PED-' + Date.now().toString().slice(-6),
          fecha: new Date().toLocaleDateString(),
          metodoPago: 'Transferencia Bancaria',
          plazoEntrega: this.pedido.producto.tiempoEntrega,
          observaciones: 'Pedido registrado correctamente',
          cliente: {
            nombre: this.pedido.usuario.nombre,
            direccion: this.pedido.usuario.direccion,
            telefono: this.pedido.usuario.telefono,
            email: this.pedido.usuario.email
          },
          productos: [{
            codigo: this.pedido.producto.id.toString(),
            nombre: `${this.pedido.producto.nombre} - Color: ${this.pedido.colorSeleccionado.nombre} - Talla: ${this.pedido.talla}`,
            cantidad: this.pedido.cantidad,
            precioUnitario: this.pedido.producto.precio,
            subtotal: this.pedido.producto.precio * this.pedido.cantidad,
            imagen: this.pedido.imagenActual
          }]
        };

        Swal.fire({
          icon: 'success',
          title: '¡Compra realizada con éxito!',
          text: 'Serás redirigido al detalle de tu pedido',
          confirmButtonColor: '#002fff',
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['/detalle-pedido'], {
            state: { pedidoData: pedidoParaDetalle }
          });
        });

        this.resetearPedido();
      },
      error: (error) => {
        console.error("Error al registrar el pedido:", error);  
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar tu pedido. Intenta nuevamente.',
          confirmButtonColor: '#002fff'
        });
      }
    });
  }

  resetearPedido(): void {
    this.pedido = {
      producto: this.productoActual,
      cantidad: 1,
      talla: '',
      colorSeleccionado: this.productoActual.colores[0],
      imagenActual: this.productoActual.colores[0].imagenes[0],
      indiceImagen: 0,
      fechaEstimada: '',
      usuario: {
        nombre: '',
        direccion: '',
        telefono: '',
        email: ''
      }
    };
    this.mostrarConfirmacion = false;
    this.calcularFechaEntrega();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}