
import { AdminEntity } from '../admin/admin.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("seller")
export class sellerEntity{
@PrimaryGeneratedColumn()
id:number;
@Column({name:'fname',type: "varchar",length: 150})
fname:string;
@Column({name:'lname',type: "varchar",length: 150})
lname:string;
@Column({type: "varchar",length: 150})
email:string;
@Column()
phone:number;

@ManyToOne(() => AdminEntity, admin => admin.managers)
admin: AdminEntity;


}
@Entity("photo")
export class PhotoEntity{
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    photoPath: string;
  
    @OneToOne(() => sellerEntity , { cascade: true })
    @JoinColumn()
    profile: sellerEntity;

}
