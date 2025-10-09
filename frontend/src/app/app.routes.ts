import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConnexionComponent } from './connexion/connexion.component';
import { PageAdminComponent } from './page-admin/page-admin.component';
import { PageUserComponent } from './page-user/page-user.component';
import { ConsultRecComponent } from './consult-rec/consult-rec.component';
import { AdminRecComponent } from './admin-rec/admin-rec.component';
import { SubmitRecComponent } from './submit-rec/submit-rec.component';
import { ChatbotAdminComponent } from './chatbot-admin/chatbot-admin.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { AccueilComponent } from './accueil/accueil.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { PageAgentComponent } from './page-agent/page-agent.component';
import { AgentRecComponent } from './agent-rec/agent-rec.component';
import { ProfilAdminComponent } from './profil-admin/profil-admin.component';
import { ProfilAgentComponent } from './profil-agent/profil-agent.component';
import { ProfilUserComponent } from './profil-user/profil-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const appRoutes: Routes = [
    { path: 'utilisateur', component: UtilisateurComponent},
    { path: 'connexion', component: ConnexionComponent},
    { path: 'page_admin', component: PageAdminComponent},
    { path: 'page_user', component: PageUserComponent},
    { path: 'consult_rec', component: ConsultRecComponent},
    { path: 'submit_rec', component: SubmitRecComponent},
    { path: 'admin_rec', component: AdminRecComponent},
    { path: 'admin_chatbot', component: ChatbotAdminComponent},
    { path: 'accueil', component: AccueilComponent},
    { path: 'inscription', component: InscriptionComponent},
    { path: 'page_agent', component: PageAgentComponent},
    { path: 'agent_rec', component: AgentRecComponent},
    { path: 'profil_agent', component: ProfilAgentComponent},
    { path: 'profil_admin', component: ProfilAdminComponent},
    { path: 'profil_user', component: ProfilUserComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: '', redirectTo: '/accueil', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
