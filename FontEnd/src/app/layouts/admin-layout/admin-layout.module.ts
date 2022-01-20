import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../views/admin/dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { AdminProfileComponent } from 'src/app/views/admin/admin-profile/admin-profile.component';
import { AdminProfileEditComponent } from 'src/app/views/admin/admin-profile-edit/admin-profile-edit.component';
import { AdminChangePasswordComponent } from 'src/app/views/admin/admin-change-password/admin-change-password.component';
import { AdminManageCakeComponent } from 'src/app/views/admin/manage-cake/admin-manage-cake/admin-manage-cake.component';


//category
import { AdminManageCategoryComponent } from 'src/app/views/admin/manage-category/admin-manage-category/admin-manage-category.component';
import { AdminCategoryDetailComponent } from 'src/app/views/admin/manage-category/admin-category-detail/admin-category-detail.component';
import { InsertCategoryComponent } from 'src/app/views/admin/manage-category/insert-category/insert-category.component';
import { UpdateCategoryComponent } from 'src/app/views/admin/manage-category/update-category/update-category.component';


//event
import { AdminEventDetailComponent } from 'src/app/views/admin/manage-event/admin-event-detail/admin-event-detail.component';
import { AdminManageEventComponent } from 'src/app/views/admin/manage-event/admin-manage-event/admin-manage-event.component';
import { InsertEventComponent } from 'src/app/views/admin/manage-event/insert-event/insert-event.component';
import { UpdateEventComponent } from 'src/app/views/admin/manage-event/update-event/update-event.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import { InsertCakeComponent } from 'src/app/views/admin/manage-cake/insert-cake/insert-cake.component';
import { AdminCakeDetailsComponent } from 'src/app/views/admin/manage-cake/admin-cake-details/admin-cake-details.component';
import { UpdateCakeComponent } from 'src/app/views/admin/manage-cake/update-cake/update-cake.component';
import { MapsComponent } from 'src/app/views/admin/maps/maps.component';
import {
  AgmCoreModule
} from '@agm/core';
import { AdminManageUserComponent } from 'src/app/views/admin/admin-manage-user/admin-manage-user.component';
import { UserDetailsComponent } from 'src/app/views/admin/user-details/user-details.component';
import { UserDetailsEditComponent } from 'src/app/views/admin/user-details-edit/user-details-edit.component';
import { InsertUserComponent } from 'src/app/views/admin/insert-user/insert-user.component';
import { ManageOrderComponent } from 'src/app/views/admin/manage-order/manage-order.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ManagePageComponent } from 'src/app/views/admin/manage-page/manage-page.component';
import { WheelDetailsComponent } from 'src/app/views/admin/admin-wheel/wheel-details/wheel-details.component';
import { InsertWheelComponent } from 'src/app/views/admin/admin-wheel/insert-wheel/insert-wheel.component';
import { ManageWheelComponent } from 'src/app/views/admin/admin-wheel/manage-wheel/manage-wheel.component';
import { UpdateWheelComponent } from 'src/app/views/admin/admin-wheel/update-wheel/update-wheel.component';
@NgModule({
  imports: [
    FileUploadModule,
    NgxPaginationModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,MatAutocompleteModule,
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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAYWsZJ2YsVwAKG7BhfZ_RWSxHzkBLXfZw'
    })],
  declarations: [
    DashboardComponent,
    ManagePageComponent,
    AdminProfileComponent,
    AdminProfileEditComponent,
    AdminChangePasswordComponent,
    //manageCake
    AdminManageCakeComponent,
    InsertCakeComponent,
    AdminCakeDetailsComponent,
    UpdateCakeComponent,
    //manageAuthor
   
    AdminManageCategoryComponent,
    AdminCategoryDetailComponent,
    InsertCategoryComponent,
    UpdateCategoryComponent,
    //manageSeri
   
    //managerEvent
    AdminEventDetailComponent,
    AdminManageEventComponent,
    InsertEventComponent,
    UpdateEventComponent,
    ManageWheelComponent,
    MapsComponent,
    AdminManageUserComponent,
    UserDetailsComponent,
    UserDetailsEditComponent,
    InsertUserComponent,
    ManageOrderComponent,
    FooterComponent,
    HeaderComponent,
    WheelDetailsComponent,
    InsertWheelComponent,
    UpdateWheelComponent
  ]
})

export class AdminLayoutModule {}
