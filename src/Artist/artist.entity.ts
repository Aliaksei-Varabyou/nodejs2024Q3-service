import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Track } from 'src/Track/track.entity';
import { Album } from 'src/Album/album.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => Track, (track) => track.artistId, { onDelete: 'SET NULL' })
  tracks: Track[];

  @OneToMany(() => Album, (album) => album.artistId, { onDelete: 'SET NULL' })
  albums: Album[];
}
