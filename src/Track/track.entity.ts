import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Artist } from 'src/Artist/artist.entity';
import { Album } from 'src/Album/album.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist, (artist) => artist.tracks, { onDelete: 'SET NULL' })
  artist: Artist;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Album, (album) => album.tracks, { onDelete: 'SET NULL' })
  album: Album;

  @Column({ nullable: true })
  albumId: string | null;

  @Column()
  duration: number;
}
