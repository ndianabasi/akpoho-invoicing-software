import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in dev mode and seeder is development
     * only
     */
    if (seeder.default.developmentOnly && !Application.inDev) {
      return
    }

    await new seeder.default(this.client).run()
  }

  public async run() {
    await this.runSeeder(await import('../Role'))
    await this.runSeeder(await import('../Permission'))
    await this.runSeeder(await import('../PermissionRole'))
    await this.runSeeder(await import('../CompanySize'))
    await this.runSeeder(await import('../CustomerTitle'))
    await this.runSeeder(await import('../Country'))
    await this.runSeeder(await import('../State'))
    await this.runSeeder(await import('../State_2'))
    await this.runSeeder(await import('../FileProvider'))
    await this.runSeeder(await import('../UserExtraCompany'))
    await this.runSeeder(await import('../FieldInputValidationType'))
    await this.runSeeder(await import('../FieldInputType'))
    await this.runSeeder(await import('../Attribute'))
    await this.runSeeder(await import('../AttributeSet'))
    await this.runSeeder(await import('../ProductType'))
    await this.runSeeder(await import('../Attribute__AttributeGroup'))
    await this.runSeeder(await import('../Company'))
  }
}
