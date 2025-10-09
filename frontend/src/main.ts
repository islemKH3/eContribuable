import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { authentInterceptor } from './app/authent.interceptor';
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { withRouterConfig } from '@angular/router';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(withInterceptors([authentInterceptor])),
    provideRouter(
      appRoutes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
    )
  ]
}).catch(err => console.error(err));
