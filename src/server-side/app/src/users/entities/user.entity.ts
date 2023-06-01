import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Relationship } from '../profile-management/entities/relationship.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column("json", { nullable: true })
  ImageLinks: any;

  @Column()
  FullName: string;

  @Column("json", { nullable: true })
  OriginJson: any;

  @OneToMany(() => Relationship, relationship => relationship.user1)
  relationshipsInitiated: Relationship[];

  @OneToMany(() => Relationship, relationship => relationship.user2)
  relationshipsReceived: Relationship[];
}
