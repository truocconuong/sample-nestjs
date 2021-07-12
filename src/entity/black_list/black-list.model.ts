import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('black_list')
export class BlackListModel {

    @PrimaryColumn('varchar', { length: 255, nullable: false })
    token!: string;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;
}
