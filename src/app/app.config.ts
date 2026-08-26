import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { MessageService, ConfirmationService } from 'primeng/api';

import { routes } from './app.routes';
import { authInterceptor } from '@core/auth/auth.interceptor';

// Repository DI — swap mock → HTTP here
import { BookRepository } from '@core/repositories/interfaces/book.repository';
import { ThesisRepository } from '@core/repositories/interfaces/thesis.repository';
import { PublicationRepository } from '@core/repositories/interfaces/publication.repository';
import { UserRepository } from '@core/repositories/interfaces/user.repository';
import { LoanRepository } from '@core/repositories/interfaces/loan.repository';

import { MockBookRepository } from '@core/repositories/mock/mock-book.repository';
import { MockThesisRepository } from '@core/repositories/mock/mock-thesis.repository';
import { MockPublicationRepository } from '@core/repositories/mock/mock-publication.repository';
import { MockUserRepository } from '@core/repositories/mock/mock-user.repository';
import { MockLoanRepository } from '@core/repositories/mock/mock-loan.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
    MessageService,
    ConfirmationService,

    // Repository bindings — swap these for HTTP implementations
    { provide: BookRepository, useClass: MockBookRepository },
    { provide: ThesisRepository, useClass: MockThesisRepository },
    { provide: PublicationRepository, useClass: MockPublicationRepository },
    { provide: UserRepository, useClass: MockUserRepository },
    { provide: LoanRepository, useClass: MockLoanRepository },
  ],
};
