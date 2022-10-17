using Microsoft.AspNetCore.Mvc;
using Tree.Datas;
using Tree.Entities;

namespace Tree.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThingsController : ControllerBase
{
    private readonly DataContext _context;

    public ThingsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Thing>> GetThings()
    {
        //var things = _context.Things.ToList();

        var things = _context.Things.OrderBy(thing => thing.Position).ToList();

        return things;
    }

    [HttpGet("{id}")]
    public ActionResult<Thing> GetThings(int id)
    {
        return _context.Things.Find(id);
    }

    [HttpGet("add-root-folder")]
    public async Task<ActionResult<Thing>> AddRootFolder()
    {
        var thing = new Thing
        {
            IsFolder = true,
            Name = "root",
            Childrens = new List<string>(),
            ParentName = null,
            File = null,
            Level = 0,
            Position = "1"
        };
        _context.Things.Add(thing);
        await _context.SaveChangesAsync();
        return thing;
    }

    [HttpGet("add-folder")]
    public async Task<ActionResult<Thing>> AddFolder(string name, string parentName)
    {
        if (_context.Things.FirstOrDefault(b => b.Name == name) != null) return BadRequest("name already taken");

        var parent = _context.Things.FirstOrDefault(b => b.Name == parentName);

        parent.Childrens.Add(name);

        var k = 1;

        string newPosition;

        while (true)
        {
            if (_context.Things.FirstOrDefault(b => b.Position == parent.Position + "." + k) == null)
            {
                newPosition = parent.Position + "." + k;
                break;
            }

            k++;
        }

        var thing = new Thing
        {
            IsFolder = true,
            Name = name,
            Childrens = new List<string>(),
            ParentName = parentName,
            File = null,
            Level = parent.Level + 1,
            Position = newPosition
        };

        _context.Things.Add(thing);
        await _context.SaveChangesAsync();
        return thing;
    }

    [HttpGet("add-file")]
    public async Task<ActionResult<Thing>> AddFile(string name, string parentName)
    {
        if (_context.Things.FirstOrDefault(b => b.Name == name) != null) return BadRequest("name already taken");

        var parent = _context.Things.FirstOrDefault(b => b.Name == parentName);

        parent.Childrens.Add(name);

        var k = 1;

        string newPosition;

        while (true)
        {
            if (_context.Things.FirstOrDefault(b => b.Position == parent.Position + "." + k) == null)
            {
                newPosition = parent.Position + "." + k;
                break;
            }

            k++;
        }

        var thing = new Thing
        {
            IsFolder = false,
            Name = name,
            Childrens = null,
            ParentName = parentName,
            File = null,
            Level = parent.Level + 1,
            Position = newPosition
        };

        _context.Things.Add(thing);
        await _context.SaveChangesAsync();
        return thing;
    }

    [HttpGet("delete/{id}")]
    public async Task<ActionResult<Thing>> Delete(int id)
    {
        if (id == 0) return BadRequest("Can't delete root folder");

        var thing = _context.Things.FirstOrDefault(b => b.Id == id);

        if (thing == null) return BadRequest("Can't delete something that does not exist");

        var parent = _context.Things.FirstOrDefault(b => b.Name == thing.ParentName);

        parent.Childrens.Remove(thing.Name);

        if (thing.IsFolder == false)
            _context.Things.Remove(thing);
        else
            DeleteBranch(thing);
        await _context.SaveChangesAsync();
        return thing;
    }

    public void DeleteBranch(Thing thing)
    {
        if (thing.IsFolder == false || thing.Childrens.Count == 0)
            _context.Things.Remove(thing);
        else
            foreach (var child in thing.Childrens)
            {
                DeleteBranch(_context.Things.FirstOrDefault(b => b.Name == child));
                _context.Things.Remove(thing);
            }
    }

    [HttpGet("rename/{id}")]
    public async Task<ActionResult<Thing>> Edit(int id, string name)
    {
        if (_context.Things.FirstOrDefault(b => b.Name == name) != null) return BadRequest("name already taken");

        var thing = _context.Things.FirstOrDefault(b => b.Id == id);

        if (thing.Id != 0)
        {
            var parent = _context.Things.FirstOrDefault(b => b.Name == thing.ParentName);

            parent.Childrens.Remove(thing.Name);

            thing.Name = name;

            parent.Childrens.Add(thing.Name);
        }

        thing.Name = name;

        foreach (var children in thing.Childrens)
        {
            var child = _context.Things.FirstOrDefault(b => b.Name == children);

            child.ParentName = thing.Name;
        }

        await _context.SaveChangesAsync();
        return thing;
    }

    [HttpGet("move/{id}")]
    public async Task<ActionResult<bool>> Move(int id, string name)
    {
        if (_context.Things.FirstOrDefault(b => b.Name == name) == null ||
            _context.Things.FirstOrDefault(b => b.Name == name).IsFolder == false)
            return BadRequest("Directory does not exist or it is not a directory");

        var destiny = _context.Things.FirstOrDefault(b => b.Name == name);

        var thing = _context.Things.FirstOrDefault(b => b.Id == id);

        if (thing.IsFolder)
            if (CheckSubfolder(thing, name))
                return false;

        var parent = _context.Things.FirstOrDefault(b => b.Name == thing.ParentName);

        parent.Childrens.Remove(thing.Name);

        thing.ParentName = destiny.Name;

        destiny.Childrens.Add(thing.Name);

        ChangeLevel(thing, destiny.Level, destiny.Position);

        await _context.SaveChangesAsync();
        return true;
    }

    public void ChangeLevel(Thing thing, int level, string position)
    {
        if (thing.IsFolder == false || thing.Childrens.Count == 0)
        {
            thing.Level = level + 1;

            var k = 1;

            string newPosition;

            while (true)
            {
                if (_context.Things.FirstOrDefault(b => b.Position == position + "." + k) == null)
                {
                    newPosition = position + "." + k;
                    break;
                }

                k++;
            }

            thing.Position = newPosition;
            _context.SaveChanges();
        }
        else
        {
            thing.Level = level + 1;

            var k = 1;

            string newPosition;

            while (true)
            {
                if (_context.Things.FirstOrDefault(b => b.Position == position + "." + k) == null)
                {
                    newPosition = position + "." + k;
                    break;
                }

                k++;
            }

            thing.Position = newPosition;
            _context.SaveChanges();
            foreach (var child in thing.Childrens)
                ChangeLevel(_context.Things.FirstOrDefault(b => b.Name == child), level + 1, thing.Position);
        }
    }

    public bool CheckSubfolder(Thing thing, string name)
    {
        var isSubfolder = false;

        if (thing.IsFolder && thing.Childrens.Count != 0)
            foreach (var child in thing.Childrens)
                if (child == name)
                {
                    isSubfolder = true;
                    return isSubfolder;
                }
                else
                {
                    return CheckSubfolder(_context.Things.FirstOrDefault(b => b.Name == child), name);
                }

        return isSubfolder;
    }

    [HttpGet("sort/{id}")]
    public async Task<ActionResult<Thing>> sort(int id)
    {
        var things = new List<string>();

        var thing = _context.Things.FirstOrDefault(b => b.Id == id);

        foreach (var child in thing.Childrens) things.Add(child);

        things.Sort();

        foreach (var child in things)
        {
            _context.Things.FirstOrDefault(b => b.Name == child).Position = "";

            _context.SaveChanges();
        }

        foreach (var child in things)
            ChangePosition(_context.Things.FirstOrDefault(b => b.Name == child), thing.Position);

        await _context.SaveChangesAsync();
        return thing;
    }

    public void ChangePosition(Thing thing, string position)
    {
        if (thing.IsFolder == false || thing.Childrens.Count == 0)
        {
            var k = 1;

            string newPosition;

            while (true)
            {
                if (_context.Things.FirstOrDefault(b => b.Position == position + "." + k) == null)
                {
                    newPosition = position + "." + k;
                    break;
                }

                k++;
            }

            thing.Position = newPosition;
            _context.SaveChanges();
        }
        else
        {
            var k = 1;

            string newPosition;

            while (true)
            {
                if (_context.Things.FirstOrDefault(b => b.Position == position + "." + k) == null)
                {
                    newPosition = position + "." + k;
                    break;
                }

                k++;
            }

            thing.Position = newPosition;
            _context.SaveChanges();
            foreach (var child in thing.Childrens)
                ChangePosition(_context.Things.FirstOrDefault(b => b.Name == child), thing.Position);
        }
    }
}