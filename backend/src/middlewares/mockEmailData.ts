export const mockEmailData = {
    book: {
      titulo: 'El gran libro de la programación',
      autor: 'Jane Doe',
      precio: 40000,
      oferta: 0,
      isbn: '978-3-16-148410-0',
      images: ['https://example.com/book.png'],
      keywords: ['programación', 'libro', 'tecnología'],
      id: '1234-5678-9101-1121-3141',
      descripcion: 'Un libro completo sobre programación.',
      estado: 'Nuevo Sellado',
      genero: 'Tecnología',
      formato: 'Físico',
      vendedor: 'John Doe',
      id_vendedor: '5678-9101-1121-3141-1234',
      edicion: '',
      idioma: 'Español',
      ubicacion: {
        ciudad: 'Medellín',
        departamento: 'Antioquia',
        pais: 'Colombia' 
      },
      tapa: 'Dura',
      edad: '',
      fecha_publicacion: '2012-12-12T10:00:00Z', 
      actualizado_en: '2023-10-01T10:00:00Z',
      disponibilidad: 'Disponible',
      mensajes: [
        ['Hola, estoy interesado en el libro.', '2023-10-01T10:00:00Z'],
        ['¿Está disponible?', '2023-10-01T10:00:00Z']
      ],
      collections_ids: ['1234-5678-9101-1121-3141']
    },
    user: {
      id: '5678-9101-1121-3141-1234',
      nombre: 'John Doe',
      rol: 'usuario',
      foto_perfil: 'https://example.com/profile.png',
      correo: 'john@gmail.com',
      contraseña: 'hashed_password',
      direccion_envio: {
        calle: 'Calle 123',
        ciudad: 'Medellín',
        pais: 'Colombia',
        codigo_postal: '050001'
      },
      libros_ids: ['1234-5678-9101-1121-3141'],
      estado_cuenta: 'Activo',
      fecha_registro: '2023-01-01T10:00:00Z',
      actualizado_en: '2023-10-01T10:00:00Z',
      bio: 'Desarrollador de software.',
      favoritos: ['1234-5678-9101-1121-3141'],
      conversations_ids: ['1234-5678-9101-1121-3141'],
      notifications_ids: ['1234-5678-9101-1121-3141'],
      validated: true,
      login: 'Default',
      ubicacion: {
        calle: 'Calle 123',
        ciudad: 'Medellín',
        pais: 'Colombia',
        codigo_postal: '050001'
      },
      seguidores: ['1234-5678-9101-1121-3141'],
      siguiendo: ['1234-5678-9101-1121-3141'],
      collections_ids: [
        {
          nombre: 'Mis libros favoritos',
          libros_ids: ['1234-5678-9101-1121-3141']
        }
      ],
      compras_ids: ['1234-5678-9101-1121-3141'],
      preferencias: {
        'programación': 5,
        'tecnología': 3
      },
      historial_busquedas: {
        'programación': 10,
        'tecnología': 5
      },
      balance: {
        pendiente: 0,
        disponible: 100000,
        por_llegar: 0
      }
    }, 
    seller: {
      id: '5678-9101-1121-3141-1234',
      nombre: 'John Doe',
      rol: 'usuario',
      foto_perfil: 'https://example.com/profile.png',
      correo: 'john@gmail.com',
      contraseña: 'hashed_password',
      direccion_envio: {
        calle: 'Calle 123',
        ciudad: 'Medellín',
        pais: 'Colombia',
        codigo_postal: '050001'
      },
      libros_ids: ['1234-5678-9101-1121-3141'],
      estado_cuenta: 'Activo',
      fecha_registro: '2023-01-01T10:00:00Z',
      actualizado_en: '2023-10-01T10:00:00Z',
      bio: 'Desarrollador de software.',
      favoritos: ['1234-5678-9101-1121-3141'],
      conversations_ids: ['1234-5678-9101-1121-3141'],
      notifications_ids: ['1234-5678-9101-1121-3141'],
      validated: true,
      login: 'Default',
      ubicacion: {
        calle: 'Calle 123',
        ciudad: 'Medellín',
        pais: 'Colombia',
        codigo_postal: '050001'
      },
      seguidores: ['1234-5678-9101-1121-3141'],
      siguiendo: ['1234-5678-9101-1121-3141'],
      collections_ids: [
        {
          nombre: 'Mis libros favoritos',
          libros_ids: ['1234-5678-9101-1121-3141']
        }
      ],
      compras_ids: ['1234-5678-9101-1121-3141'],
      preferencias: {
        'programación': 5,
        'tecnología': 3
      },
      historial_busquedas: {
        'programación': 10,
        'tecnología': 5
      },
      balance: {
        pendiente: 0,
        disponible: 100000,
        por_llegar: 0
      }
    },  
    transaction: {
      id: 1,
      user_id: '5678-9101-1121-3141-1234',
      book_id: '1234-5678-9101-1121-3141',
      seller_id: '5678-9101-1121-3141-1234',
      status: 'pending',
      shipping_details: {
      additional_info: {
        ip_address: '277.0.0.1'
      },
      address: {
        city: 'Medellín',
        department: 'Antioquia',
        neighborhood: 'El Poblado',
        street_name: 'Calle 10',
        street_number: '123',
        zip_code: '050001'
      },
      first_name: 'John',
      last_name: 'Doe',
      phone: {
        area_code: '57',
        number: '123456789'
      }
    },
      date_created: '2023-10-01T10:00:00Z',
      date_approved: '2023-10-01T10:05:00Z',
      date_last_updated: '2023-10-01T10:10:00Z',
      date_of_expiration: '2023-11-01T10:00:00Z',
      money_release_date: '2023-10-10T10:00:00Z',
      money_release_schema: 'standard',
      money_release_status: 'pending',
      operation_type: 'regular_payment',
      issuer_id: 'issuer_123',
      payment_method_id: 'visa',
      payment_type_id: 'credit_card',
      payment_method: {
        id: 'visa',
        type: 'credit_card',
        name: 'Visa'
      },
      status_detail: 'pending_waiting_payment',
      currency_id: 'COP',
      description: 'Compra de libro',
      live_mode: false,
      sponsor_id: 1001,
      authorization_code: 'AUTH123456',
      integrator_id: 'integrator_001',
      taxes_amount: 5000,
      counter_currency: 'USD',
      shipping_amount: 10000,
      build_version: '1.0.0',
      pos_id: 'POS123',
      store_id: 'STORE123',
      platform_id: 'PLATFORM123',
      corporation_id: 'CORP123',
      payer: {
        id: 'payer_001',
        email: 'john@gmail.com',
        identification: {
          type: 'CC',
          number: '123456789'
        }
      },
      collector_id: 2001,
      metadata: { custom: 'data' },
      additional_info: {
        items: [
          {
            id: '1234-5678-9101-1121-3141',
            title: 'El gran libro de la programación',
            quantity: 1,
            unit_price: 40000
          }
        ]
      },
      order: {
        id: 'order_001',
        type: 'book'
      },
      external_reference: 'ref_001',
      transaction_amount: 40000,
      transaction_amount_refunded: 0,
      coupon_amount: 0,
      differential_pricing_id: 'diff_001',
      deduction_schema: 'none',
      installments: 1,
      transaction_details: {
        net_received_amount: 39000,
        total_paid_amount: 40000,
        overpaid_amount: 0,
        installment_amount: 40000
      },
      fee_details: [
        {
          type: 'mercadopago_fee',
          amount: 1000
        }
      ],
      charges_details: [
        {
          name: 'shipping',
          amount: 10000
        }
      ],
      captured: true,
      binary_mode: false,
      call_for_authorize_id: 'call_auth_001',
      statement_descriptor: 'BOOKSTORE',
      card: {
        id: 'card_001',
        last_four_digits: '1234',
        expiration_month: 12,
        expiration_year: 2025,
        cardholder: {
          name: 'John Doe'
        }
      },
      notification_url: 'https://example.com/notify',
      refunds: [],
      processing_mode: 'default',
      merchant_account_id: 'merchant_001',
      merchant_number: 'MN123',
      point_of_interaction: {
        type: 'web',
        sub_type: 'checkout'
      },
      three_ds_info: {
        external_resource_url: 'https://3ds.example.com'
      },
      callback_url: 'https://example.com/callback',
      coupon_code: '',
      net_amount: 39000,
      payment_method_option_id: 'option_001',
      taxes: [
        {
          id: 'tax_001',
          name: 'IVA',
          amount: 5000
        }
      ],
      internal_metadata: { test: true }
    },
    shipping_details: {
      additional_info: {
        ip_address: '277.0.0.1'
      },
      address: {
        city: 'Medellín',
        department: 'Antioquia',
        neighborhood: 'El Poblado',
        street_name: 'Calle 10',
        street_number: '123',
        zip_code: '050001'
      },
      first_name: 'John',
      last_name: 'Doe',
      phone: {
        area_code: '57',
        number: '123456789'
      }
    },
    metadata: {
      guia: '123456789',
      validation_code: 123456,
      validation_link: 'https://example.com/validate',
      barcode: {
        type: 'code_128',
        value: '123456789'
      },
      date_of_expiration: '2023-11-01T10:00:00Z'
    }
  }