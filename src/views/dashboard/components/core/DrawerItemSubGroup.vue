<template>
  <DrawerItemGroup :route="route" text sub-group />
</template>

<script>
export default {
  name: 'DrawerItemSubGroup',
  components: {
    DrawerItemGroup: () => import('@/views/dashboard/components/core/DrawerItemGroup'),
  },
  props: {
    route: {
      type: Object,
      default: () => ({
        avatar: undefined,
        group: undefined,
        title: undefined,
        children: [],
      }),
    },
  },
}
</script>
