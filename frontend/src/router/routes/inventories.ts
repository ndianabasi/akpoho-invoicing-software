export default {
  path: 'inventories',
  component: () => import('pages/inventories/InventoryIndex.vue'),
  redirect: '/inventories/products',
  meta: {
    label: 'Inventories',
    icon: 'inventory',
    permission: 'can_list_inventories',
  },
  children: [
    {
      path: '',
      redirect: '/inventories/products',
      name: 'all_inventory',
      meta: {
        label: 'All Inventory',
        icon: 'inventory',
      },
    },
    {
      path: 'products',
      component: () => import('pages/inventories/products/ProductIndex.vue'),
      name: 'products',
      meta: {
        label: 'Products',
        icon: 'local_grocery_store',
      },
      children: [
        {
          path: '',
          component: () => import('pages/inventories/products/Products.vue'),
          name: 'all_products',
          meta: {
            label: 'All Products',
            icon: 'local_grocery_store',
          },
        },
        {
          path: ':productId/view',
          component: () => import('pages/inventories/products/Product.vue'),
          props: true,
          name: 'view_product',
          meta: {
            label: 'View Product',
            permission: 'can_view_inventories',
          },
        },
        {
          path: ':productId/edit',
          component: () => import('pages/inventories/products/EditProduct.vue'),
          props: true,
          name: 'edit_product',
          meta: {
            label: 'Edit Product',
            permission: 'can_edit_inventories',
          },
        },
        {
          path: 'new',
          component: () =>
            import('pages/inventories/products/new/CreateProductIndex.vue'),
          name: 'create_product_index',
          meta: {
            label: 'New Product',
            icon: 'add_circle',
            permission: 'can_create_inventories',
          },
          children: [
            {
              path: '',
              redirect: '/inventories/products/new/simple-product',
              name: 'create_product',
              meta: {
                label: 'New Product',
                icon: 'local_grocery_store',
              },
            },
            {
              path: 'simple-product',
              component: () =>
                import(
                  'pages/inventories/products/new/CreateSimpleProduct.vue'
                ),
              name: 'create_simple_product',
              meta: {
                label: 'New Simple Product',
                permission: 'can_create_inventories',
              },
            },
          ],
        },
      ],
    },
  ],
};
