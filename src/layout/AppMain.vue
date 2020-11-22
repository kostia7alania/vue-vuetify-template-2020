<template>
  <v-main>
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col class="shrink">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn icon large target="_blank" v-on="on">
                <v-icon large>mdi-code-tags</v-icon>
              </v-btn>

              <Dadata />
            </template>
            <span>Source</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
