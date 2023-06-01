import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column("json", { nullable: true })
  Friends: any;

  @Column("json", { nullable: true })
  Games: any;

  // Other columns...
}
