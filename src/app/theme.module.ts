import { ModuleWithProviders, NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { AutenticationService } from '../@core/utils/autentication.service';
// import { ImplicitAutenticationService } from '../@core/utils/implicit_autentication.service';
// import { SharedModule } from '../shared/shared.module';
// import { DocumentoService } from '../@core/data/documento.service';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {A11yModule} from '@angular/cdk/a11y';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

const MAT_MODULES = [
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    ScrollingModule,
    A11yModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ];

export class DemoMaterialModule {}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
// import {
//   NbActionsModule,
//   NbCardModule,
//   NbLayoutModule,
//   NbMenuModule,
//   NbRouteTabsetModule,
//   NbSearchModule,
//   NbSidebarModule,
//   NbTabsetModule,
//   NbThemeModule,
//   NbUserModule,
//   NbCheckboxModule,
//   NbPopoverModule,
//   NbContextMenuModule,
// } from '@nebular/theme';

// import { NbSecurityModule } from '@nebular/security';

// import {
//   FooterComponent,
//   HeaderComponent,
//   SearchInputComponent,
//   ThemeSettingsComponent,
//   SwitcherComponent,
//   LayoutDirectionSwitcherComponent,
//   ThemeSwitcherComponent,
//   TinyMCEComponent,
//   DinamicformComponent,
//   SelectComponent,
//   NuxeoComponent,
//   ThemeSwitcherListComponent,
//   LoadingComponent,
// } from './components';

// import { CapitalizePipe, PluralPipe, RoundPipe, TimingPipe } from './pipes';

// import {
//   OneColumnLayoutComponent,
//   SampleLayoutComponent,
//   ThreeColumnsLayoutComponent,
//   TwoColumnsLayoutComponent,
// } from './layouts';

// import { DEFAULT_THEME } from './styles/theme.default';
// import { COSMIC_THEME } from './styles/theme.cosmic';
// import { CORPORATE_THEME } from './styles/theme.corporate';
// import { NotificacionesService } from '../@core/utils/notificaciones.service';
// import { ConfiguracionService } from '../@core/data/configuracion.service';

// const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

// const NB_MODULES = [
//   NbCardModule,
//   NbLayoutModule,
//   NbTabsetModule,
//   NbRouteTabsetModule,
//   NbMenuModule,
//   NbUserModule,
//   NbActionsModule,
//   NbSearchModule,
//   NbSidebarModule,
//   NbCheckboxModule,
//   NbPopoverModule,
//   NbContextMenuModule,
//   NgbModule,
//   NbSecurityModule, // *nbIsGranted directive
// ];

// const COMPONENTS = [
//   SwitcherComponent,
//   LayoutDirectionSwitcherComponent,
//   ThemeSwitcherComponent,
//   ThemeSwitcherListComponent,
//   HeaderComponent,
//   FooterComponent,
//   SearchInputComponent,
//   ThemeSettingsComponent,
//   TinyMCEComponent,
//   OneColumnLayoutComponent,
//   SampleLayoutComponent,
//   ThreeColumnsLayoutComponent,
//   TwoColumnsLayoutComponent,
//   DinamicformComponent,
//   SelectComponent,
//   NuxeoComponent,
//   LoadingComponent,
// ];

// const ENTRY_COMPONENTS = [
//   ThemeSwitcherListComponent,
// ];

// const PIPES = [
//   CapitalizePipe,
//   PluralPipe,
//   RoundPipe,
//   TimingPipe,
// ];

// const NB_THEME_PROVIDERS = [
//   ...NbThemeModule.forRoot(
//     {
//       name: 'default',
//     },
//     [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME ],
//   ).providers,
//   ...NbSidebarModule.forRoot().providers,
//   ...NbMenuModule.forRoot().providers,
// ];


@NgModule({
  imports: [...MAT_MODULES],
  exports: [...MAT_MODULES],
  declarations: [],
  entryComponents: [],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [],
    };
  }
}
