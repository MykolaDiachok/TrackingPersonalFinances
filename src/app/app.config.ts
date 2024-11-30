import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DataStore } from './stores/data-store.service';
import { provideComponentStore } from '@ngrx/component-store';
import { StoreModule } from '@ngrx/store';
import { componentStateReducer } from './stores/component-state.reducer';
import { StoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideComponentStore(DataStore),
    importProvidersFrom(
      StoreModule.forRoot({ componentState: componentStateReducer }),
      StoreDevtoolsModule.instrument({
        maxAge: 50,
        logOnly: false,
      }),
    ),
  ],
};
